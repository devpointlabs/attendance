class Enrollment < ApplicationRecord
  validates :role, inclusion: { in: %w(teacher ta student) }, allow_blank: true
  belongs_to :course
  belongs_to :user
end
