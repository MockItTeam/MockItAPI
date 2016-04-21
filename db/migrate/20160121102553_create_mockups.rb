class CreateMockups < ActiveRecord::Migration
  def change
    create_table :mockups do |t|
      t.string :description
      t.text :json_elements
      t.integer :status, default: 0, index: true
      t.references :raw_image,index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
      t.references :project, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
