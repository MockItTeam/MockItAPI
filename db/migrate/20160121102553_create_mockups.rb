class CreateMockups < ActiveRecord::Migration
  def change
    create_table :mockups do |t|
      t.string :description
      t.text :json_elements
      t.references :raw_image
      t.integer :owner_id
      t.references :project

      t.timestamps null: false
    end
  end
end
