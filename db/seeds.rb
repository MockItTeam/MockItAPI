# Owner User
owner = FactoryGirl.create(:owner)

members = (0..4).map { FactoryGirl.create(:user) }

invited_member = FactoryGirl.create(:user)

# Project
project = FactoryGirl.create(:project, owner: owner)
project.members << members

# Projects for mockit user
(0..4).map do
  p = FactoryGirl.create(:project, owner: owner)
  p.members << owner
end

(0..4).map do
  user = members.sample
  raw_image = FactoryGirl.create(:raw_image, user: user)

  # Mockup
  FactoryGirl.create(:mockup, project: project, user: user, raw_image: raw_image)
end

# Invitation
invitation = FactoryGirl.build(:invitation, sender: owner, recipient: invited_member, project: project)
invitation.save
