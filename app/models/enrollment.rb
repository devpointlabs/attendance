class Enrollment < ApplicationRecord
  acts_as_paranoid

  validates :role, inclusion: { in: %w(teacher ta student) }, allow_blank: true
  belongs_to :course
  belongs_to :user
  has_many :records
end
