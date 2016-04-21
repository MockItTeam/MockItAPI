require 'rails_helper'

RSpec.describe Mockup, type: :model do
  let(:owner) { FactoryGirl.create(:user) }
  let(:project) { FactoryGirl.create(:project, owner: owner) }
  let(:raw_image) { FactoryGirl.create(:raw_image, owner: owner) }

  context 'db' do
    context 'columns' do
      it { should have_db_column(:name).of_type(:string) }
      it { should have_db_column(:json_elements).of_type(:text) }
    end
  end

  context 'Attributes' do
    it 'has name' do
      expect(FactoryGirl.build(:mockup, name: 'blah blah', owner: owner, raw_image: raw_image, project: project))
        .to have_attributes(name: 'blah blah')
    end
  end

  describe 'Validation' do
    context 'of valid parameters' do
      let(:mockup) { FactoryGirl.build(:mockup, owner: owner, raw_image: raw_image, project: project) }

      before { mockup.save }

      it 'check name length' do
        expect(mockup).to validate_length_of(:name)
      end

      it 'check validity of description' do
        expect(mockup).to be_valid
      end

      it 'check owner of mockup' do
        expect(mockup.owner).to eq owner
      end

      it 'check belongs to project' do
        expect(mockup.project).to eq project
      end
    end

    context 'of invalid parameters' do
      let(:invalid_mockup) { FactoryGirl.build(:invalid_mockup, owner: owner, raw_image: raw_image, project: project) }

      before { invalid_mockup.save }

      subject { invalid_mockup.errors }
      it { is_expected.to include :name }

      context 'with format error message' do
        subject { invalid_mockup.errors.messages[:name][0] }
        # look like not allowed
        it { is_expected.to match(/only.*allowed/i) }
      end
    end
  end
end
