Feature: SignUp User

  Scenario: Successfully get the user token
    Given a valid user with name, addres, email, password, confirmPassword
    Then the user will be created and will be added to the account database
    And return the user and the access token

  # Scenario: Fail to signup user by missing a property
  #   Given an user missing a property, like name, addres, email, password, confirmPassword...
  #   Then an error message should be returned

  # Scenario: Fail to signup user by invalid property
  #   Given an invalid property, like email, password, confirmPassword
  #   Then an error message should be returned

  # Scenario: Fail to signup user because email is already in use
  #   Given an invalid email that is already in use by other user
  #   Then an error message should be returned
