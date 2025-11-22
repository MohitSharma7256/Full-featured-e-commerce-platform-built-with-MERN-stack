import PasswordValidator from "password-validator"
var schema = new PasswordValidator();

// Add properties to it(password schema - isme kya kya hona chahiye or kya kya nhi hona chahiye wahi define hua hai)
schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase(1)                             // Must have at least 1 uppercase letter
  .has().lowercase(1)                             // Must have at least 1 lowercase letter
  .has().digits(1)                                // Must have at least 2 digit
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

export default function FormValidator(e) {
  let { name, value } = e.target
  switch (name) {
    case "name":
    case "username":
    case "icon":
      if (!value || value.length === 0)
        return name + " Field is Mendatory"
      else if (value.length < 3)
        return name + " Length Must Be Upto 3 Characters"
      else
        return ""

    case "email":
      if (!value || value.length === 0)
        return name + " Field is Mendatory"
      else if (value.length < 13)
        return name + " Length Must Be More Then 13 Characters"
      else
        return ""

    case "password":
      if (!value || value.length === 0)
        return name + " Field is Mendatory"
      else if (!schema.validate(value))
        return "Invalid Password, It Must Container 8-100 Character in Which 1 Must Be Upper Case Alphabet, 1 Lower Case Alphabet, 1 Digit and Should Not Contain Any Space"
      else
        return ""

    case "phone":
      if (!value || value.length === 0)
        return name + " Field is Mendatory"
      else if (value.length !== 10)
        return name + " Length Must Be 10 Characters"
      else if (!(value.startsWith("9") || value.startsWith("8") || value.startsWith("7") || value.startsWith("6")))
        return name + " Field is Invalid"
      else
        return ""



    case "baseprice":
      if (!value || value.length === 0)
        return "Base Price Field is Mendatory"
      else if (parseInt(value) < 1)
        return "Base Price Must Be Greater Then 0"
      else
        return ""

    case "discount":
      if (!value || value.length === 0)
        return "Base Price Field is Mendatory"
      else if (parseInt(value) < 0 || parseInt(value) > 100)
        return "Discount Must Be Within 0-100"
      else
        return ""

    case "stockQuantity":
      if (!value || value.length === 0)
        return "Base Price Field is Mendatory"
      else if (parseInt(value) < 0)
        return "Stock Quantity Must Not Be Negative"
      else
        return ""

    case "shortDescription":
      if (!value || value.length === 0)
        return name + " Field is Mendatory"
      else if (value.length < 50 || value.length > 200)
        return name + " Length Must Be 50-200 Characters"
      else
        return ""

    case "question":
      if (!value || value.length === 0)
        return name + " Field is Mendatory"
      else if (value.length < 10 || value.length > 200)
        return name + " Length Must Be 10-200 Characters"
      else
        return ""

    case "answer":
      if (!value || value.length === 0)
        return name + " Field is Mendatory"
      else if (value.length < 50)
        return name + " Length Must Be Upto 50 Characters"
      else
        return ""


    default:
      return ""
  }
}
