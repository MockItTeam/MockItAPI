class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :name
      t.references :user
      t.integer :status, default: 0, index: true

      t.timestamps null: false
    end
  end
end
