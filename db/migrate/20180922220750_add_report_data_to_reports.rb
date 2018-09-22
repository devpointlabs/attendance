class AddReportDataToReports < ActiveRecord::Migration[5.2]
  def change
    add_column :reports, :report_type, :string
    add_column :reports, :url, :string
  end
end
