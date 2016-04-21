class AddDeletedAtToAllModel < ActiveRecord::Migration
  def up
    add_column :users, :deleted_at, :datetime
    add_column :projects, :deleted_at, :datetime
    add_column :mockups, :deleted_at, :datetime
    add_column :invitations, :deleted_at, :datetime
    add_column :raw_images, :deleted_at, :datetime
  end

  def down
    remove_column :users, :deleted_at
    remove_column :projects, :deleted_at
    remove_column :mockups, :deleted_at
    remove_column :invitations, :deleted_at
    remove_column :raw_images, :deleted_at
  end
end
