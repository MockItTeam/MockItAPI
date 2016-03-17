require 'rails_helper'

RSpec.describe Invitation, type: :model do
  let(:sender) { FactoryGirl.create(:sender) }
  let(:recipient) { FactoryGirl.create(:recipient) }
  let(:project) { FactoryGirl.create(:project, owner: sender) }

  context 'db' do
    context 'columns' do
      it { should have_db_column(:status).of_type(:integer) }
    end
  end

  context 'Attributes' do
    it 'has description' do
      expect(FactoryGirl.build(:invitation, sender: sender, recipient: recipient, project: project))
        .to have_attributes(status: 'pending')
    end
  end

  describe 'Validation' do
    context 'of valid parameters' do
      let(:valid_invitation) { FactoryGirl.build(:invitation, sender: sender, recipient: recipient, project: project) }

      before { valid_invitation.save }

      it 'check sender presence' do
        expect(valid_invitation).to validate_presence_of(:sender)
      end

      it 'check recipient presence' do
        expect(valid_invitation).to validate_presence_of(:recipient)
      end

      it 'check project presence' do
        expect(valid_invitation).to validate_presence_of(:project)
      end

      it 'check status pending' do
        expect(valid_invitation.status).to eq 'pending'
      end

      it 'checks validity of name' do
        expect(valid_invitation).to be_valid
      end

      it 'check sender match' do
        expect(valid_invitation.sender).to eq sender
      end

      it 'check recipient match' do
        expect(valid_invitation.recipient).to eq recipient
      end

      it 'check project match' do
        expect(valid_invitation.project).to eq project
      end
    end

    context 'of invalid parameters' do
      let(:invalid_invitation) { FactoryGirl.build(:invitation, project: project) }

      before { invalid_invitation.save }

      subject { invalid_invitation.errors }
      it { is_expected.to include :sender, :recipient }

      context 'with error message' do
        subject { invalid_invitation.errors.messages[:sender][0] }
        it { is_expected.to match(/not.*founded/i) }

        subject { invalid_invitation.errors.messages[:recipient][0] }
        it { is_expected.to match(/not.*founded/i) }
      end
    end
  end
end
