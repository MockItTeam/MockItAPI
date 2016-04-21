class CreateRawImages < ActiveRecord::Migration
  def change
    create_table :raw_images do |t|
      t.string :name
      t.integer :status, default: 0, index: true
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
