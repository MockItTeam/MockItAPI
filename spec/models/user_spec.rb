require 'rails_helper'

RSpec.describe User, type: :model do
  context 'db' do
    context 'columns' do
      it { should have_db_column(:username).of_type(:string).with_options(null: false) }
    end

    context 'indexes' do
      it { should have_db_index(:username).unique(true) }
    end
  end

  context 'Attributes' do
    it 'has username' do
      expect(FactoryGirl.build(:user, username: 'example')).to have_attributes(username: 'example')
    end
  end

  describe 'Validation' do
    context 'of valid parameters' do
      let(:valid_user) { FactoryGirl.create(:user) }

      it 'checks username presence' do
        expect(valid_user).to validate_presence_of(:username)
      end

      it 'checks username validate length' do
        expect(valid_user).to validate_length_of(:username)
      end

      it 'checks username validate uniqueness' do
        expect(valid_user).to validate_uniqueness_of(:username).ignoring_case_sensitivity
      end

      it 'checks validity of username' do
        expect(valid_user).to be_valid
      end
    end

    context 'of invalid parameters' do
      let(:user) { FactoryGirl.build(:user, username: 'mockit') }
      let(:other_user) { FactoryGirl.build(:user, username: 'mockit') }
      let(:invalid_user) { FactoryGirl.build(:user, username: '#####') }

      before do
        user.save
        other_user.save
        invalid_user.save
      end

      subject { other_user.errors }
      it { is_expected.to include :username }

      context 'with uniqueness error message' do
        subject { other_user.errors.messages[:username][0] }
        it { is_expected.to match(/has.*taken/i) }
      end

      subject { invalid_user.errors }
      it { is_expected.to include :username }

      context 'with format error message' do
        subject { invalid_user.errors.messages[:username][0] }
        # look like not allowed
        it { is_expected.to match(/Only.*allowed/i) }
      end
    end
  end
end
