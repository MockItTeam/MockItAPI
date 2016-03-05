# Owner User
owner = FactoryGirl.create(:mockit)

members = (0..4).map do
  FactoryGirl.create(:user)
end

invited_member = FactoryGirl.create(:user)

# Project
project = FactoryGirl.build(:project, owner: owner)
project.members << members
project.save

(0..4).map do
  user = members.sample
  raw_image = FactoryGirl.create(:raw_image, user: user)

  # Mockup
  FactoryGirl.create(:mockup, project: project, user: user, raw_image: raw_image)
end

# Invitation
invitation = FactoryGirl.build(:invitation, sender: owner, recipient: invited_member, project: project)
invitation.save
