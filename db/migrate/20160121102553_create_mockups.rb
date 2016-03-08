class CreateMockups < ActiveRecord::Migration
  def change
    create_table :mockups do |t|
      t.string :description
      t.references :raw_image
      t.integer :owner_id
      t.references :project
      t.integer :status, default: 0, index: true

      t.timestamps null: false
    end
  end
end
