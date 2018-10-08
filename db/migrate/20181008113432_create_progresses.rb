class CreateProgresses < ActiveRecord::Migration[5.2]
  def change
    create_table :progresses do |t|
      t.date :week_start
      t.date :week_end
      t.float :assignments
      t.float :attendance
      t.float :total
      t.string :grade
      t.belongs_to :enrollment, foreign_key: true

      t.timestamps
    end
  end
end
