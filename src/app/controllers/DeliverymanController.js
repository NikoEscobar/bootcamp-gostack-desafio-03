import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object()
      .shape({
        name: Yup.string().required(),
        avatar_id: Yup.number(),
        email: Yup.string()
          .email()
          .required(),
      })
      .noUnknown();

    if (!(await schema.isValid(req.body, { strict: true }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({
        error: 'Deliveryman already exists.',
      });
    }
    //[TODO]passar avatar_id para outra tabela,
    //a tornando uma chave estrangeira
    const { id, name, avatar_id, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      avatar_id,
      email,
    });
  }

  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'avatar_id', 'name', 'email'],
    });
    //[TODO]criar paginação
    return res.json(deliverymans);
  }

  async update(req, res) {
    const schema = Yup.object()
      .shape({
        deliveryman_id: Yup.number().required(),
        name: Yup.string(),
        avatar_id: Yup.number(),
        email: Yup.string().email(),
      })
      .noUnknown()
      .test(
        'at-least-one-unrequired-value',
        'you must provide at least one unrequired value',
        value => !!(value.name || value.email || value.avatar_id)
      );

    if (!(await schema.isValid(req.body, { strict: true }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, email } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email } });

      if (deliverymanExists) {
        return res
          .status(400)
          .json({ error: 'This email is already registered' });
      }
    }

    const { id, name, avatar_id } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      avatar_id,
      email,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id, {
      attributes: ['id', 'name', 'avatar_id', 'email'],
    });
    //[TODO]mover os dados para uma tabela temporaria antes de deletar
    await deliveryman.destroy();
    return res.json({ deliveryman, msg: 'Was removed.' });
  }
}

export default new DeliverymanController();
