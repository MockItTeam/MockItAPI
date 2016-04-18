class AddErrorMessageToMockups < ActiveRecord::Migration
  def up
    add_column :mockups, :error_message, :text
  end

  def down
    remove_column :mockups, :error_message, :text
  end
end
