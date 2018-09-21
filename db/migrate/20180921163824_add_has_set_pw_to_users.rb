class AddHasSetPwToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :has_set_pw, :boolean, default: false
  end
end
