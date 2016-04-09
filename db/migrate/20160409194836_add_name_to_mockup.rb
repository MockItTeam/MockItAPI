class AddNameToMockup < ActiveRecord::Migration
  def up
    rename_column :mockups, :description, :name
  end

  def down
    rename_column :mockups, :name, :description
  end
end
