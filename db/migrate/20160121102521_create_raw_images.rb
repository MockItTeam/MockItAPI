class CreateRawImages < ActiveRecord::Migration
  def change
    create_table :raw_images do |t|
      t.integer :owner_id
      t.string :name
      t.integer :status, default: 0, index: true

      t.timestamps null: false
    end
  end
end
