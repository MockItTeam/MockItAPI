class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.integer :from_user_id, index: true
      t.integer :to_user_id, index: true
      t.references :project
      t.integer :status, default: 0, index: true

      t.timestamps null: false
    end
  end
end
