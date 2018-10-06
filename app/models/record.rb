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

  def self.upload(data)
    course = Course.find_by(canvas_id: data.first[:course])
    data.each do |row|
      course_id  = course.id
      user_id = row[:id].to_i
      enrollment = Enrollment.find_by(course_id: course_id, canvas_enrollment_id: user_id)
      next unless enrollment
      date = row[:date].to_date
      record = enrollment.records.find_or_create_by(day: date)
      status = row[:status] == 'late' ? 'tardy' : row[:status]
      record.update(status: status)
    end
  end
end
