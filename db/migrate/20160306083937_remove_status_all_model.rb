class RemoveStatusAllModel < ActiveRecord::Migration
  def up
    remove_column :users, :status
    remove_column :projects, :status
    remove_column :mockups, :status
    remove_column :raw_images, :status
  end

  def down
    add_column :users, :status, :integer
    add_column :projects, :status, :integer
    add_column :mockups, :status, :integer
    add_column :raw_images, :status, :integer
  end
end
