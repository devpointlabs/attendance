class AddDeletedAtToReports < ActiveRecord::Migration[5.2]
  def change
    add_column :reports, :deleted_at, :datetime
    add_index :reports, :deleted_at
  end
end
