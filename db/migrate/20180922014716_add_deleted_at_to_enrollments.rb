class AddDeletedAtToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :deleted_at, :datetime
    add_index :enrollments, :deleted_at
  end
end
