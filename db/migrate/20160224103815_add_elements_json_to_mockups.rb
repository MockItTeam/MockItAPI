class AddElementsJsonToMockups < ActiveRecord::Migration
  def change
    add_column :mockups, :json_elements, :text
  end
end
