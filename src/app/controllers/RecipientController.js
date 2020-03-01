import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object()
      .shape({
        name: Yup.string().required(),
        street_address: Yup.string().required(),
        street_number: Yup.string().required(),
        address_complement: Yup.string(),
        city: Yup.string().required(),
        state: Yup.string().required(),
        zipcode: Yup.string().required(),
      })
      .noUnknown();

    if (!(await schema.isValid(req.body, { strict: true }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      id,
      name,
      street_address,
      street_number,
      address_complement,
      city,
      state,
      zipcode,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street_address,
      street_number,
      address_complement,
      city,
      state,
      zipcode,
    });
  }

  async update(req, res) {
    const schema = Yup.object()
      .shape({
        recipient_id: Yup.number().required(),
        name: Yup.string(),
        street_address: Yup.string(),
        street_number: Yup.string(),
        address_complement: Yup.string(),
        city: Yup.string(),
        state: Yup.string(),
        zipcode: Yup.string(),
      })
      .noUnknown()
      .test(
        'at-least-one-unrequired-value',
        'you must provide at least one unrequired value',
        value =>
          !!(
            value.name ||
            value.street_address ||
            value.street_number ||
            value.address_complement ||
            value.city ||
            value.state ||
            value.zipcode
          )
      );

    if (!(await schema.isValid(req.body, { strict: true }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id);

    const {
      id,
      name,
      street_address,
      street_number,
      address_complement,
      city,
      state,
      zipcode,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street_address,
      street_number,
      address_complement,
      city,
      state,
      zipcode,
    });
  }
}

export default new RecipientController();
