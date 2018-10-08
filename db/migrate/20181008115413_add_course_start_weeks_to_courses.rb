class AddCourseStartWeeksToCourses < ActiveRecord::Migration[5.2]
  def change
    add_column :courses, :course_start, :date
    add_column :courses, :weeks, :integer, default: 11
    Course.where(weeks: nil).update_all(weeks: 11)
  end
end
