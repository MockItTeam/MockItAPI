require 'rails_helper'

RSpec.describe Project, type: :model do
  let(:owner) { FactoryGirl.create(:owner) }
  let(:members) { (0..2).map { FactoryGirl.create(:user) } }

  context 'db' do
    context 'columns' do
      it { should have_db_column(:name).of_type(:string) }
      it { should have_db_column(:image).of_type(:string) }
    end
  end

  context 'Attributes' do
    it 'has name' do
      expect(FactoryGirl.build(:project, name: 'Mockit', owner: owner)).to have_attributes(name: 'Mockit')
    end
  end

  describe 'Validation' do
    context 'of valid parameters' do
      let(:valid_project) { FactoryGirl.build(:project, owner: owner) }

      before do
        valid_project.save
        valid_project.members << members
      end

      it 'checks name presence' do
        expect(valid_project).to validate_presence_of(:name)
      end

      it 'checks name validate length' do
        expect(valid_project).to validate_length_of(:name)
      end

      it 'check owner of project' do
        expect(valid_project.owner).to eq owner
      end

      it 'checks members list of project' do
        expect(valid_project.members.count).to eq (members.count + 1)
      end
    end

    context 'of invalid parameters' do
      let(:duplicate_name) { 'duplicated' }
      let!(:valid_project) { FactoryGirl.build(:project, name: duplicate_name, owner: owner) }
      let!(:other_project) { FactoryGirl.build(:project, name: duplicate_name, owner: owner) }
      let!(:invalid_project) { FactoryGirl.build(:invalid_project, owner: owner) }

      before do
        valid_project.save
        other_project.save
        invalid_project.save
      end

      context 'with uniqueness error message' do
        it { expect(other_project.errors).to include :base }
        it { expect(other_project.errors.messages[:base][0]).to match(/Name.*user/i) }
      end

      context 'with format error message' do
        it { expect(invalid_project.errors).to include :name }
        it { expect(invalid_project.errors.messages[:name][0]).to match(/Only.*allowed/i) }
      end
    end
  end
end
