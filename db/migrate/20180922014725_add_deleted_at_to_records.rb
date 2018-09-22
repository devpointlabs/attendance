class AddDeletedAtToRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :deleted_at, :datetime
    add_index :records, :deleted_at
  end
end
