const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { saveNewVillain, getVillainBySlug, getAllVillains } = require('../../controllers/villains')
const models = require('../../models')
const {
  afterEach, before, beforeEach, after, describe, it
} = require('mocha')
const { postedVillain, singleVillain, villainsList } = require('../mocks/villains')


chai.use(sinonChai)
const { expect } = chai

describe('Controllers - Villians', () => {
  let response
  let sandbox
  let stubbedCreate
  let stubbedFindOne
  let stubbedFindAll
  let stubbedSend
  let stubbedSendStatus
  let stubbedStatus
  let stubbedStatusDotSend

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindAll = sandbox.stub(models.Villains, 'findAll')
    stubbedFindOne = sandbox.stub(models.Villains, 'findOne')
    stubbedCreate = sandbox.stub(models.Villains, 'create')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusDotSend = sandbox.stub()
    stubbedStatus = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusDotSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
  })


  describe('getAllVillains', () => {
    it('retrieves a list of villains from the database and calls response.send() with the list', async () => {
      stubbedFindAll.returns(villainsList)

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.been.calledWith({ attributes: ['name', 'movie', 'slug'] })
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })

    it('returns a 500 status when an error occurs retrieving the teams', async () => {
      stubbedFindAll.throws('ERROR!')

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.been.calledWith({ attributes: ['name', 'movie', 'slug'] })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to get all villains, please try again')
    })
  })

  describe('getVillainBySlug', () => {
    it('retrieves the villain associated with the provided slug from the database and calls response.send() with it', async () => {
      const request = { params: { slug: 'gaston' } }

      stubbedFindOne.returns(singleVillain)

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: { slug: 'gaston' },
        attributes: ['name', 'movie', 'slug']
      })
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })

    it('returns a 404 status when no villain is found', async () => {
      const request = { params: { slug: 'edgy' } }

      stubbedFindOne.returns(null)

      await getVillainBySlug(request, response)

      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 status when an error occurs retrieving the villain by slug', async () => {
      const request = { params: { slug: 'fish-gibblets' } }

      stubbedFindOne.throws('ERROR!')

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: { slug: 'fish-gibblets' },
        attributes: ['name', 'movie', 'slug']
      })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to get villain, please try again')
    })
  })

  describe('saveNewVillain', () => {
    it('accepts new villain details and saves them as a new villain in the database, returning the saved record with a 201 status', async () => {
      const request = { body: singleVillain }

      stubbedCreate.returns(singleVillain)

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(singleVillain)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusDotSend).to.have.been.calledWith(singleVillain)
    })

    it('returns a 400 status when not all required fields are provided (missing location)', async () => {
      const { name, movie } = postedVillain
      const request = { body: { name, movie } }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedSendStatus).to.have.been.calledWith(400)
    })

    it('returns a 500 status when an error occurs saving the new villain', async () => {
      const request = { body: postedVillain }

      stubbedCreate.throws('ERROR!')

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(postedVillain)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to save villain, please try again')
    })
  })
})
