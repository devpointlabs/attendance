class CreateEnrollments < ActiveRecord::Migration[5.2]
  def change
    create_table :enrollments do |t|
      t.belongs_to :course, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.string :role, default: 'student'

      t.timestamps
    end
  end
end
