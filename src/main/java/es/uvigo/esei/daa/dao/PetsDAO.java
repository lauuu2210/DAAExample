package es.uvigo.esei.daa.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import es.uvigo.esei.daa.entities.Pet;

/**
 * DAO class for the {@link Person} entities.
 * 
 * @author Laura Perez
 *
 */
public class PetsDAO extends DAO{
    private static final Logger LOG = Logger.getLogger(PetsDAO.class.getName());

    public Pet get(int id) throws DAOException {

		try (final Connection connect = this.getConnection()) {
			try (final PreparedStatement statement = connect.prepareStatement("SELECT * FROM pets WHERE id=?")) {
				statement.setInt(1, id);

				try (final ResultSet result = statement.executeQuery()) {
					if (result.next()) {
						return rowToEntity(result);
					} else {
						throw new IllegalArgumentException("Invalid id");
					}
				}
			}
		} catch (SQLException e) {
			LOG.log(Level.SEVERE, "Error getting a pet", e);
			throw new DAOException(e);
		}
	}

    public List<Pet> list() throws DAOException {
		try (final Connection connect = this.getConnection()) {
			try (final PreparedStatement statement = connect.prepareStatement("SELECT * FROM pets")) {
				try (final ResultSet result = statement.executeQuery()) {

					final List<Pet> pets = new LinkedList<>();

					while (result.next()) {
						pets.add(rowToEntity(result));
					}

					return pets;
				}
			}
		} catch (SQLException e) {
			LOG.log(Level.SEVERE, "Error listing pets", e);
			throw new DAOException(e);
		}
	}

    public List<Pet> listByOwner(int owner) throws DAOException {
		try (final Connection connect = this.getConnection()) {
			try (final PreparedStatement statement = connect.prepareStatement("SELECT * FROM pets WHERE owner=?")) {
				statement.setInt(1, owner);
				try (final ResultSet result = statement.executeQuery()) {

					final List<Pet> pets = new LinkedList<>();

					while (result.next()) {
						pets.add(rowToEntity(result));
					}

					return pets;
				}
			}
		} catch (SQLException e) {
			LOG.log(Level.SEVERE, "Error listing pets", e);
			throw new DAOException(e);
		}
	}

    public void modify(Pet pet) throws DAOException, IllegalArgumentException {
		if (pet == null) {
			throw new IllegalArgumentException("pet can't be null");
		}

		try (final Connection connect = this.getConnection()) {
			try (PreparedStatement statement = connect.prepareStatement("UPDATE pets SET name=?, owner=? WHERE id=?")) {
				statement.setInt(3, pet.getId());
				statement.setString(1, pet.getName());
				statement.setInt(2, pet.getOwner());

				if (statement.executeUpdate() != 1) {
					throw new IllegalArgumentException("name and owner can't be null");
				}
			}
		} catch (SQLException e) {
			LOG.log(Level.SEVERE, "Error modifying a pet", e);
			throw new DAOException();
		}
	}

    public void delete(int id) throws DAOException {
		try (final Connection connect = this.getConnection()) {
			try (final PreparedStatement statement = connect.prepareStatement("DELETE FROM pets WHERE id=?")) {

				statement.setInt(1, id);

				if (statement.executeUpdate() != 1) {
					throw new IllegalArgumentException("Invalid id");
				}
			}
		} catch (SQLException e) {
			LOG.log(Level.SEVERE, "Error deleting a pet", e);
			throw new DAOException(e);
		}
	}

    public Pet add(String name, int owner, String ownerName) throws DAOException, IllegalArgumentException {
		if (name == null) {
			throw new IllegalArgumentException("name can't be null");
		}

		try (final Connection connect = this.getConnection()) {
			try (final PreparedStatement statement = connect.prepareStatement("INSERT INTO pets VALUES(null, ?, ?)", Statement.RETURN_GENERATED_KEYS)) {
				statement.setString(1, name);
				statement.setInt(2, owner);

				if (statement.executeUpdate() == 1) {
					try (ResultSet resultKeys = statement.getGeneratedKeys()) {
						if (resultKeys.next()) {
							return new Pet(resultKeys.getInt(1), name, owner, ownerName);
						} else {
							LOG.log(Level.SEVERE, "Error retrieving inserted id");
							throw new SQLException("Error retrieving inserted id");
						}
					}
				} else {
					LOG.log(Level.SEVERE, "Error inserting value");
					throw new SQLException("Error inserting value");
				}
			}
		} catch (SQLException e) {
			LOG.log(Level.SEVERE, "Error adding a pet", e);
			throw new DAOException(e);
		}
	}

    private Pet rowToEntity(ResultSet row) throws SQLException, DAOException {

		return new Pet(row.getInt("id"), row.getString("name"), row.getInt("owner"), getOwnerName(row.getInt("owner")));
	}

	private String getOwnerName(int id) throws DAOException {

		try (final Connection connect = this.getConnection()) {
			try (final PreparedStatement statement = connect.prepareStatement("SELECT * FROM people WHERE id=?")) {
				statement.setInt(1, id);

				try (final ResultSet result = statement.executeQuery()) {
					if (result.next()) {
						return result.getString("name");
					} else {
						throw new IllegalArgumentException("Invalid id");
					}
				}
			}
		} catch (SQLException e) {
			LOG.log(Level.SEVERE, "Error getting a pet", e);
			throw new DAOException(e);
		}
	}
}
