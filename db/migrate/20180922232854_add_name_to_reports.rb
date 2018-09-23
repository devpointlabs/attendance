class AddNameToReports < ActiveRecord::Migration[5.2]
  def change
    add_column :reports, :name, :string
  end
end
