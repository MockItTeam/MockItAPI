class AddDeletedAtToAllModel < ActiveRecord::Migration
  def change
    add_column :users, :deleted_at, :datetime
    add_column :projects, :deleted_at, :datetime
    add_column :mockups, :deleted_at, :datetime
    add_column :invitations, :deleted_at, :datetime
    add_column :raw_images, :deleted_at, :datetime
  end
end
