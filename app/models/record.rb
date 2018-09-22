class Record < ApplicationRecord
  acts_as_paranoid
  belongs_to :enrollment

  def self.by_course(course_id, date)
    date = Date::strptime(date, "%m/%d/%Y")
    select('DISTINCT(e.id), status')
    .joins("INNER JOIN enrollments e ON e.course_id = #{course_id}
            AND records.enrollment_id = e.id")
    .where(day: date)
  end
end
