/*
  Warnings:

  - A unique constraint covering the columns `[student_id,class_id]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "enrollments_student_class_unique";

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_student_class_unique" ON "enrollments"("student_id", "class_id");
