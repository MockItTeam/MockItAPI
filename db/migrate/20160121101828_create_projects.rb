class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :name
      t.integer :owner_id, null: false, index: true

      t.timestamps null: false
    end
  end
end
