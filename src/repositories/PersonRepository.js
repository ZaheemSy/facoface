import DatabaseService from '../database/DatabaseService';

const PersonRepository = {
  getAll() {
    return DatabaseService.getPersons();
  },

  getById(id) {
    return DatabaseService.getPersonById(id);
  },

  create(name, embedding) {
    return DatabaseService.savePerson(name, embedding);
  },

  update(id, name) {
    DatabaseService.updatePerson(id, name);
  },

  updateEmbedding(id, embedding) {
    DatabaseService.updatePersonEmbedding(id, embedding);
  },

  delete(id) {
    DatabaseService.deletePerson(id);
  },

  search(query) {
    return DatabaseService.searchPersons(query);
  },
};

export default PersonRepository;
