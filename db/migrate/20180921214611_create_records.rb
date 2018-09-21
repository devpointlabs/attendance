class CreateRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :records do |t|
      t.belongs_to :enrollment, foreign_key: true
      t.string :status
      t.date :day

      t.timestamps
    end
  end
end
