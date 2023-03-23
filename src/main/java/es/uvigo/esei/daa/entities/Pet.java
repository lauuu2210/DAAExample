package es.uvigo.esei.daa.entities;

import static java.util.Objects.requireNonNull;

/**
 * An entity that represents a pet.
 * 
 * @author Laura Perez
 */
public class Pet {
	private int id;
	private String name;
	private int ownerId;
	private String ownerName;
	
	// Constructor needed for the JSON conversion
	Pet() {}
	
	/**
	 * Constructs a new instance of {@link Pet}.
	 *
	 * @param id identifier of the pet.
	 * @param name Pet.
	 * @param owner person who owns the Pet.
	 */
	public Pet(int id, String name, int owner, String ownerName) {
		this.id = id;
		this.setName(name);
		this.setOwner(owner);
		this.setOwnerName(ownerName);
	}
	
	/**
	 * Returns the identifier of the pet.
	 * 
	 * @return the identifier of the pet.
	 */
	public int getId() {
		return id;
	}

	/**
	 * Returns the name of the pet.
	 * 
	 * @return the name of the pet.
	 */
	public String getName() {
		return name;
	}

	/**
	 * Set the name of this Pet.
	 * 
	 * @param name the new Pet.
	 * @throws NullPointerException if the {@code name} is {@code null}.
	 */
	public void setName(String name) {
		this.name = requireNonNull(name, "Name can't be null");
	}

	/**
	 * Returns the owner of the pet.
	 * 
	 * @return the owner of the pet.
	 */
	public int getOwner() {
		return ownerId;
	}

	/**
	 * Returns the owner of the pet.
	 * 
	 * @return the owner of the pet.
	 */
	public String getOwnerName() {
		return ownerName;
	}

	/**
	 * Set the owner of this Pet.
	 * 
	 * @param owner the new owner of the pet.
	 * @throws NullPointerException if the {@code surname} is {@code null}.
	 */
	public void setOwner(int owner) {
		this.ownerId = requireNonNull(owner, "Owner can't be null");
	}

	public void setOwnerName(String owner) {
		this.ownerName = requireNonNull(owner, "Owner can't be null");
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (!(obj instanceof Pet))
			return false;
		Pet other = (Pet) obj;
		if (id != other.id)
			return false;
		return true;
	}
}
