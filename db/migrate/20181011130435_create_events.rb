class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :name
      t.string :label, default: 'Other'
      t.date :event_date
      t.time :event_start
      t.time :event_end
      t.json :details

      t.timestamps
    end
  end
end
