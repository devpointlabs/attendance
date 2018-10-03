class AddDeletedAtToGradeWeight < ActiveRecord::Migration[5.2]
  def change
    add_column :grade_weights, :deleted_at, :datetime
  end
end
