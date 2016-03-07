require 'rails_helper'

RSpec.describe Project, type: :model do
  let(:user) { FactoryGirl.create(:user) }

  context 'db' do
    context 'columns' do
      it { should have_db_column(:name).of_type(:string) }
    end
  end

  context 'Attributes' do
    it 'has name' do
      expect(FactoryGirl.build(:project, name: 'Mockit', owner: user)).to have_attributes(name: 'Mockit')
    end
  end

  describe 'Validation' do
    context 'of valid parameters' do
      let(:valid_project) { FactoryGirl.create(:project, owner: user) }

      it 'checks name presence' do
        expect(valid_project).to validate_presence_of(:name)
      end

      it 'checks name validate length' do
        expect(valid_project).to validate_length_of(:name)
      end

      it 'checks name validate uniqueness' do
        expect(valid_project).to validate_uniqueness_of(:name)
      end

      it 'checks validity of name' do
        expect(valid_project).to be_valid
      end
    end

    context 'of invalid parameters' do
      let(:valid_project) { FactoryGirl.build(:project, name: 'Mockit', owner: user) }
      let(:other_project) { FactoryGirl.build(:project, name: 'Mockit', owner: user) }
      let(:invalid_project) { FactoryGirl.build(:project, name: '#####', owner: user) }

      before do
        valid_project.save
        other_project.save
        invalid_project.save
      end

      subject { other_project.errors }
      it { is_expected.to include :name }

      context 'with uniqueness error message' do
        subject { other_project.errors.messages[:name][0] }
        it { is_expected.to match(/Project.*unique/i) }
      end

      subject { invalid_project.errors }
      it { is_expected.to include :name }

      context 'with format error message' do
        subject { invalid_project.errors.messages[:name][0] }
        # look like not allowed
        it { is_expected.to match(/Only.*allowed/i) }
      end
    end
  end
end
