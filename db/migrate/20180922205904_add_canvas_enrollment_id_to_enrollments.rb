class AddCanvasEnrollmentIdToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :canvas_enrollment_id, :integer
  end
end
