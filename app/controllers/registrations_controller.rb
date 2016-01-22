class RegistrationsController < Devise::RegistrationsController
  protect_from_forgery except: :create

  def create
    block_given = block_given?
    super do |user|
      yield user if block_given
      if !user.persisted?
        clean_up_passwords user
        respond_to do |format|
          format.json { render json: {errors: [user.errors.full_messages.to_sentence]}, status: :unprocessable_entity }
        end
      else
        if user.active_for_authentication?
          sign_up(resource_name, user)
          respond_to do |format|
            format.json { render json: {message: I18n.t('devise.registrations.signed_up')}, status: :created }
          end
        else
          expire_data_after_sign_in!
          respond_to do |format|
            format.json { render json: {message: I18n.t("devise.registrations.signed_up_but_#{user.inactive_message}")}, status: :created }
          end
        end
      end
      return
    end
  end

  protected

  # Override default Devise sign up params
  def sign_up_params
    params.require(:user).permit(:username, :password)
  end
end