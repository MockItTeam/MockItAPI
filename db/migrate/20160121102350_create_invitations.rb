class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.integer :sender_id, index: true
      t.integer :recipient_id, index: true
      t.references :project
      t.integer :status, default: 0, index: true

      t.timestamps null: false
    end
  end
end
