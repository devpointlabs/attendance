class Enrollment < ApplicationRecord
  acts_as_paranoid

  validates :role, inclusion: { in: %w(teacher ta student) }, allow_blank: true
  belongs_to :course
  belongs_to :user
  has_many :records

  def self.students
    select('DISTINCT(enrollments.id), u.name, u.email, c.name AS course_name, c.id AS course_id, u.image')
      .joins('INNER JOIN courses c ON c.id = enrollments.course_id
              INNER JOIN users u on u.id = enrollments.user_id')
      .where(role: 'student')
      .group('c.id, enrollments.id, u.name, u.email, c.name, u.image')
      .order('u.name')
  end
end
