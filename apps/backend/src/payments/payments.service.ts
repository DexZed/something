import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { PaymentStatus } from '../generated/prisma/enums.js';
@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_API_SECRET')!,
    );
  }

  // 1. Create Checkout Session
  async createCheckoutSession(userId: string, classId: number) {
    // Check if user is already enrolled
    // const existingEnrollment = await prisma.enrollment.findUnique({
    //   where: {
    //     studentId_classId: {
    //       studentId: userId,
    //       classId: classId,
    //     },
    //   },
    // });

    // if (existingEnrollment) {
    //   throw new ConflictException('You are already enrolled in this class');
    // }

    const classItem = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    const unitAmount = Math.round(Number(classItem.price) * 100);

    // Create a pending payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        classId,
        amount: classItem.price,
        currency: classItem.currency,
        status: PaymentStatus.pending,
      },
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: classItem.currency,
            product_data: {
              name: classItem.name,
              description: classItem.description || undefined,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://b7a6-fieser-management.onrender.com/success.html',
      cancel_url: 'https://b7a6-fieser-management.onrender.com/failed.html',
      metadata: {
        userId,
        classId: classId.toString(),
        paymentId: payment.id.toString(),
      },
    });

    // Save Stripe session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return {
      url: session.url,
      stripeId: session.id,
    };
  }

  async verifyAndFulfillSession(userId: string, sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new NotFoundException('Stripe checkout session not found');
    }

    if (session.payment_status !== 'paid') {
      throw new BadRequestException(
        'Payment has not been completed successfully',
      );
    }

    const paymentId = Number(session.metadata?.paymentId);
    const classId = Number(session.metadata?.classId);
    const paymentIntentId = session.payment_intent as string;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    // If already succeeded, just return success
    if (payment.status === PaymentStatus.succeeded) {
      return { success: true, message: 'Already verified and enrolled' };
    }

    // Update payment status and create enrollment atomically
    await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.succeeded,
          stripePaymentIntentId: paymentIntentId,
        },
      });

      // Safely create enrollment
      await tx.enrollment.create({
        data: {
          studentId: userId,
          classId: classId,
          paymentId: updatedPayment.id,
        },
      });
    });

    return {
      success: true,
      message: 'Payment verified and enrollment successful',
    };
  }

  // async successPage(userId: string, res: ExpressResponse) {
  //   const getDetails = await prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //     include: {
  //       payments: {
  //         include: {
  //           class: {
  //             select: {
  //               name: true,
  //               description: true,
  //               schedules: true,
  //             },
  //           },
  //         },
  //         select: {
  //           stripePaymentIntentId: true,
  //           status: true,
  //           amount: true,
  //         },
  //         orderBy: {
  //           createdAt: 'desc',
  //         },
  //         take: 1,
  //       },
  //     },
  //   });

  //   return res.render('payments/success', {
  //     transactionId: getDetails?.payments[0]?.stripeCheckoutSessionId,
  //     amount: getDetails?.payments[0]?.amount,
  //     className: getDetails?.payments[0]?.class?.name,
  //     classDescription: getDetails?.payments[0]?.class?.description,
  //     classDay: 'Monday - Friday',
  //     classStart: '9:00 AM',
  //     classEnd: '5:00 PM',
  //   });
  // }
  // async cancelPage(userId: string, res: ExpressResponse) {
  //   return res.render('payments/cancel', {
  //     message: 'Payment cancelled',
  //   });
  // }
}
