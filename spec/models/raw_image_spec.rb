require 'rails_helper'

RSpec.describe RawImage, type: :model do
  let(:owner) { FactoryGirl.create(:user) }

  context 'db' do
    context 'columns' do
      it { should have_db_column(:name).of_type(:string) }
      it { should have_db_column(:status).of_type(:integer) }
    end
  end
end
