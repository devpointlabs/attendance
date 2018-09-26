class AddStandardToGradeWeights < ActiveRecord::Migration[5.2]
  def change
    add_column :grade_weights, :standard, :json
  end
end
