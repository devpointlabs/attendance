class CreateGradeWeights < ActiveRecord::Migration[5.2]
  def change
    create_table :grade_weights do |t|
      t.belongs_to :course, foreign_key: true
      t.float :assignments
      t.float :attendance

      t.timestamps
    end
  end
end
